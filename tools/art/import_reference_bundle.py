#!/usr/bin/env python3
"""Import or verify the exact user-approved V2 art bundle. No network or Git writes."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import sys
from zipfile import BadZipFile, ZipFile

MANIFEST_PATH = Path("docs/art/reference_bundle_manifest.json")
PREFIX = "content/art/characters/reference-v2/"


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def target_path(repo: Path, relative: str) -> Path:
    parts = PurePosixPath(relative)
    if not relative.startswith(PREFIX) or parts.is_absolute() or ".." in parts.parts:
        raise ValueError(f"Destination outside the approved asset directory: {relative}")
    candidate = repo.joinpath(*parts.parts)
    for path in [candidate, *candidate.parents]:
        if path == repo:
            break
        if path.is_symlink():
            raise ValueError(f"Refusing a symlink destination: {path}")
    candidate.resolve().relative_to(repo)
    return candidate


def check_bytes(data: bytes, entry: dict, label: str) -> None:
    if len(data) != entry["bytes"] or digest(data) != entry["sha256"]:
        raise ValueError(f"Size or SHA-256 mismatch: {label}")


def verify(repo: Path, entries: list[dict]) -> list[str]:
    problems = []
    for entry in entries:
        path = target_path(repo, entry["repository_path"])
        if not path.is_file():
            problems.append(f"MISSING {entry['repository_path']}")
            continue
        try:
            check_bytes(path.read_bytes(), entry, entry["repository_path"])
        except ValueError as exc:
            problems.append(str(exc))
    return problems


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("bundle", nargs="?", type=Path, help="Approved original ZIP")
    parser.add_argument("--repo", type=Path, default=Path(__file__).resolve().parents[2])
    parser.add_argument("--verify-only", action="store_true")
    args = parser.parse_args()
    repo = args.repo.resolve()
    if args.verify_only and args.bundle:
        parser.error("--verify-only does not accept a bundle")
    if not args.verify_only and args.bundle is None:
        parser.error("Provide the approved ZIP, or use --verify-only")
    manifest = json.loads((repo / MANIFEST_PATH).read_text(encoding="utf-8"))
    if manifest.get("schema") != "project-tactics/approved-art-reference-bundle":
        raise ValueError("Unexpected manifest schema")
    entries = manifest["files"]
    paths = [e["repository_path"] for e in entries]
    members = [e["source_member"] for e in entries]
    if len(set(paths)) != len(paths) or len(set(members)) != len(members):
        raise ValueError("Duplicate paths in manifest")
    for relative in paths:
        target_path(repo, relative)
    if not args.verify_only:
        archive = args.bundle.read_bytes()
        check_bytes(archive, manifest["archive"], args.bundle.name)
        pending = []
        # Preflight every entry before writing anything. Never extract arbitrary paths.
        with ZipFile(args.bundle) as bundle:
            names = bundle.namelist()
            if len(names) != len(set(names)) or set(names) != set(members):
                raise ValueError("Unexpected or duplicate ZIP members")
            for entry in entries:
                if bundle.getinfo(entry["source_member"]).file_size != entry["bytes"]:
                    raise ValueError(f"Unexpected ZIP member size: {entry['source_member']}")
                data = bundle.read(entry["source_member"])
                check_bytes(data, entry, entry["source_member"])
                target = target_path(repo, entry["repository_path"])
                if target.exists():
                    check_bytes(target.read_bytes(), entry, entry["repository_path"])
                else:
                    pending.append((target, data))
        for target, data in pending:
            target.parent.mkdir(parents=True, exist_ok=True)
            # Exclusive creation prevents overwriting a concurrently-created file.
            with target.open("xb") as stream:
                stream.write(data)
        print(f"Imported {len(pending)} files; preserved {len(entries) - len(pending)} identical files.")
    problems = verify(repo, entries)
    if problems:
        print("Reference verification FAILED:\n" + "\n".join(problems), file=sys.stderr)
        return 1
    print(f"PASS: {len(entries)} approved files, exact sizes and SHA-256. No Git commit created.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, ValueError, KeyError, TypeError, BadZipFile) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)
