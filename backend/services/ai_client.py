import json
import logging
import re
from typing import Optional, Dict, Any, Tuple
from backend.config import settings

logger = logging.getLogger("food_verse.ai_client")

class GeminiClientWrapper:
    def __init__(self):
        self._client = None
        self._initialized = False

    def get_client(self):
        if not settings.GEMINI_API_KEY:
            return None
        if not self._initialized:
            try:
                from google import genai
                self._client = genai.Client(api_key=settings.GEMINI_API_KEY)
                self._initialized = True
                logger.info("Google GenAI client initialized successfully.")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini client: {e}")
                self._client = None
        return self._client

    def is_available(self) -> bool:
        return bool(settings.GEMINI_API_KEY and self.get_client() is not None)

    @staticmethod
    def extract_json(text: str) -> Optional[Dict[str, Any]]:
        """Extract valid JSON from LLM response, stripping markdown code blocks if present."""
        if not text:
            return None
        text = text.strip()
        # Remove ```json and ``` fences
        json_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        if json_match:
            text = json_match.group(1).strip()
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # Try to locate the outermost { }
            first_brace = text.find("{")
            last_brace = text.rfind("}")
            if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
                try:
                    return json.loads(text[first_brace:last_brace + 1])
                except Exception:
                    pass
            logger.warning(f"Could not parse valid JSON from text: {text[:200]}...")
            return None

    def generate_multimodal_json(
        self,
        image_bytes: bytes,
        mime_type: str,
        system_prompt: str,
        user_prompt: str,
        model: Optional[str] = None
    ) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        """
        Sends image and prompts to Gemini API and expects structured JSON output.
        Returns: (parsed_json, error_message)
        """
        client = self.get_client()
        if not client:
            return None, "Gemini API key is not configured (Demo Mode active)."

        target_model = model or settings.GEMINI_MODEL
        try:
            from google.genai import types

            full_prompt = f"{system_prompt}\n\nUSER REQUEST:\n{user_prompt}\n\nIMPORTANT: Return ONLY a valid JSON object matching the requested schema. No conversational filler."

            contents = [
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                full_prompt
            ]

            response = client.models.generate_content(
                model=target_model,
                contents=contents,
            )

            if not response or not response.text:
                return None, "Empty response received from Gemini model."

            parsed = self.extract_json(response.text)
            if not parsed:
                return None, f"Failed to extract structured JSON from model response. Raw text snippet: {response.text[:200]}"

            return parsed, None

        except Exception as e:
            error_str = str(e)
            logger.error(f"Gemini multimodal generation error: {error_str}")
            return None, f"AI generation error: {error_str}"

    def generate_text_json(
        self,
        system_prompt: str,
        user_prompt: str,
        model: Optional[str] = None
    ) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        """
        Sends text prompt to Gemini API and expects structured JSON output.
        Returns: (parsed_json, error_message)
        """
        client = self.get_client()
        if not client:
            return None, "Gemini API key is not configured (Demo Mode active)."

        target_model = model or settings.GEMINI_MODEL
        try:
            full_prompt = f"{system_prompt}\n\nUSER REQUEST:\n{user_prompt}\n\nIMPORTANT: Return ONLY a valid JSON object matching the requested schema. No conversational preamble."

            response = client.models.generate_content(
                model=target_model,
                contents=full_prompt,
            )

            if not response or not response.text:
                return None, "Empty response received from Gemini model."

            parsed = self.extract_json(response.text)
            if not parsed:
                return None, f"Failed to extract structured JSON from model response. Raw snippet: {response.text[:200]}"

            return parsed, None

        except Exception as e:
            error_str = str(e)
            logger.error(f"Gemini text generation error: {error_str}")
            return None, f"AI generation error: {error_str}"

ai_client = GeminiClientWrapper()
