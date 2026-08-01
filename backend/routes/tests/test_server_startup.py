import importlib
import os
import sys
import unittest
from pathlib import Path


class ServerStartupTests(unittest.TestCase):
    def test_server_imports_without_pinecone_configuration(self):
        backend_dir = Path(__file__).resolve().parents[1]
        if str(backend_dir) not in sys.path:
            sys.path.insert(0, str(backend_dir))

        os.environ.pop("PINECONE_API_KEY", None)
        os.environ.pop("PINECONE_INDEX", None)

        sys.modules.pop("server", None)
        server = importlib.import_module("server")

        self.assertTrue(hasattr(server, "app"))


if __name__ == "__main__":
    unittest.main()
