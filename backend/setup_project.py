import os

# Define folders and their corresponding files
structure = {
    "app": [
        "main.py",
        "models.py",
        "schemas.py",
        "crud.py",
        "database.py",
        "auth.py",
        {
            "routes": [
                "__init__.py",
                "tickets.py",
                "stats.py",
                "auth.py"
            ]
        },
        "__init__.py"
    ],
    "tests": [
        "__init__.py"
    ]
}


def create_structure(base_path, structure):
    for folder, contents in structure.items():
        folder_path = os.path.join(base_path, folder)
        os.makedirs(folder_path, exist_ok=True)
        print(f"📁 Created folder: {folder_path}")
        for item in contents:
            if isinstance(item, dict):
                # Handle nested folders
                create_structure(folder_path, item)
            else:
                file_path = os.path.join(folder_path, item)
                open(file_path, 'a').close()
                print(f"📄 Created file: {file_path}")


def build_project():
    root_path = os.getcwd()
    create_structure(root_path, structure)

    # Root-level files
    with open(os.path.join(root_path, "requirements.txt"), "w") as f:
        f.write("fastapi\nuvicorn\nsqlalchemy\npydantic\npython-dotenv\n")
    print("📄 Created file: requirements.txt")

    with open(os.path.join(root_path, "README.md"), "w") as f:
        f.write("# Surakarta Heritage Ticketing Backend\n\nRun with:\n```bash\nuvicorn app.main:app --reload\n```")
    print("📄 Created file: README.md")


if __name__ == "__main__":
    build_project()
