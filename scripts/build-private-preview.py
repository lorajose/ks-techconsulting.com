"""Build an owner-only, static review copy without PHP or lead delivery."""
from pathlib import Path
import shutil
import sys

ROOT = Path(__file__).resolve().parent.parent
DEST = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT / ".private-preview" / "dist"
PAGES = [
    "index.html", "solutions.html", "start.html", "es.html", "about.html",
    "salesforce-repair.html", "reparacion-salesforce.html", "contracts.html",
    "nodejs-integrations.html", "pos-commerce.html", "ai-adoption.html",
    "lead-handoff.html", "ai-lab.html",
]
ASSETS = [
    "css/v2.css", "js/v2.js", "js/private-preview.js", "js/ai-lab.js",
    "img/logo1.png", "img/favicon-brand.svg", "img/team-k.jpg",
    "img/team-j.jpg", "img/team-a.jpg",
]
if DEST.exists():
    shutil.rmtree(DEST)
DEST.mkdir(parents=True)
for name in PAGES:
    html = (ROOT / name).read_text(encoding="utf-8")
    html = html.replace("<head>", '<head><meta name="robots" content="noindex,nofollow,noarchive">', 1)
    html = html.replace("</body>", '<script defer src="js/private-preview.js"></script></body>', 1)
    target = DEST / name
    target.write_text(html, encoding="utf-8")
for name in ASSETS:
    target = DEST / name
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(ROOT / name, target)
(DEST / "robots.txt").write_text("User-agent: *\nDisallow: /\n", encoding="utf-8")
print(f"Built {len(PAGES)} private review pages in {DEST}")
