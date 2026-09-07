"""Check local links, fragments, unique IDs and primary headings without dependencies."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path, self.links, self.ids, self.errors = path, [], set(), []
        self.headings = 0
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.headings += tag == 'h1'
        if 'id' in attrs:
            if attrs['id'] in self.ids:
                self.errors.append(f"Duplicate ID: {attrs['id']}")
            self.ids.add(attrs['id'])
        for attr in ('href', 'src'):
            if attrs.get(attr):
                self.links.append(attrs[attr])


pages = {path.resolve(): Page(path) for path in ROOT.rglob('*.html')}
errors = []
for path, page in pages.items():
    if page.headings != 1:
        page.errors.append(f'Expected one h1; found {page.headings}')
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc:
            continue
        relative = unquote(url.path)
        if relative.startswith('/mon-site/'):
            target = ROOT / relative.removeprefix('/mon-site/')
        else:
            target = path.parent / relative if relative else path
        target = target.resolve()
        if target.is_dir():
            target /= 'index.html'
        if not target.exists():
            page.errors.append(f'Missing file: {link}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            page.errors.append(f'Missing fragment: {link}')
    errors.extend(f'{path.relative_to(ROOT)}: {error}' for error in page.errors)
if errors:
    raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} HTML pages; local links, fragments, IDs and h1 headings.')
