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

    def set_api_key(self, key: str):
        settings.GEMINI_API_KEY = key.strip()
        self._client = None
        self._initialized = False
        if settings.GEMINI_API_KEY:
            self.get_client()

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

    def verify_api_key(self, test_key: Optional[str] = None) -> Tuple[bool, str, Optional[str]]:
        """
        Actively verifies whether a Gemini API key can authenticate and generate text.
        Returns: (is_valid, status_message, detected_model)
        """
        key_to_test = (test_key or settings.GEMINI_API_KEY).strip()
        if not key_to_test:
            return False, "No API key provided.", None

        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=key_to_test)
            candidate_models = [settings.GEMINI_MODEL, "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
            # Deduplicate while preserving order
            models_to_test = []
            for m in candidate_models:
                if m not in models_to_test:
                    models_to_test.append(m)

            last_error = ""
            for model_id in models_to_test:
                try:
                    response = client.models.generate_content(
                        model=model_id,
                        contents="Food Verse AI verification ping",
                        config=types.GenerateContentConfig(max_output_tokens=5)
                    )
                    if response and (response.text or response.candidates):
                        return True, f"Verified connection to Google GenAI using model '{model_id}'", model_id
                except Exception as err:
                    err_msg = str(err)
                    last_error = err_msg
                    if "404" in err_msg or "not found" in err_msg.lower():
                        continue
                    # Credential or quota errors
                    return False, f"Gemini API authentication failed: {err_msg}", None

            return False, f"All candidate Gemini models failed: {last_error}", None

        except Exception as e:
            return False, f"GenAI SDK error: {str(e)}", None

    def generate_multimodal_json(
        self,
        image_bytes: bytes,
        mime_type: str,
        system_prompt: str,
        user_prompt: str,
        model: Optional[str] = None
    ) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        """
        Sends image and prompts to Gemini API with JSON mime type configuration.
        Returns: (parsed_json, error_message)
        """
        client = self.get_client()
        if not client:
            return None, "Gemini API key is not configured (Demo Mode active)."

        target_model = model or settings.GEMINI_MODEL
        candidate_models = [target_model, "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
        models_to_try = []
        for m in candidate_models:
            if m not in models_to_try:
                models_to_try.append(m)

        from google.genai import types

        last_error = ""
        for model_id in models_to_try:
            try:
                contents = [
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                    f"{system_prompt}\n\nUSER REQUEST:\n{user_prompt}\n\nRespond ONLY with a valid JSON object matching the schema."
                ]

                config = types.GenerateContentConfig(
                    response_mime_type="application/json"
                )

                response = client.models.generate_content(
                    model=model_id,
                    contents=contents,
                    config=config
                )

                if response and response.text:
                    parsed = self.extract_json(response.text)
                    if parsed:
                        return parsed, None

            except Exception as e:
                last_error = str(e)
                logger.warning(f"Model {model_id} call failed: {last_error}. Trying next candidate if available.")
                if "not found" in last_error.lower() or "404" in last_error:
                    continue
                # If quota/auth error, don't spam models
                break

        return None, f"AI generation error: {last_error}"

    def generate_text_json(
        self,
        system_prompt: str,
        user_prompt: str,
        model: Optional[str] = None
    ) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
        """
        Sends text prompt to Gemini API with JSON mime type configuration.
        Returns: (parsed_json, error_message)
        """
        client = self.get_client()
        if not client:
            return None, "Gemini API key is not configured (Demo Mode active)."

        target_model = model or settings.GEMINI_MODEL
        candidate_models = [target_model, "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
        models_to_try = []
        for m in candidate_models:
            if m not in models_to_try:
                models_to_try.append(m)

        from google.genai import types

        last_error = ""
        for model_id in models_to_try:
            try:
                full_prompt = f"{system_prompt}\n\nUSER REQUEST:\n{user_prompt}\n\nRespond ONLY with a valid JSON object matching the requested schema."
                config = types.GenerateContentConfig(
                    response_mime_type="application/json"
                )

                response = client.models.generate_content(
                    model=model_id,
                    contents=full_prompt,
                    config=config
                )

                if response and response.text:
                    parsed = self.extract_json(response.text)
                    if parsed:
                        return parsed, None

            except Exception as e:
                last_error = str(e)
                logger.warning(f"Model {model_id} call failed: {last_error}.")
                if "not found" in last_error.lower() or "404" in last_error:
                    continue
                break

        return None, f"AI generation error: {last_error}"

ai_client = GeminiClientWrapper()
