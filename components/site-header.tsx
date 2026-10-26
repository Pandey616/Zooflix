import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Zooflix home">
          <span className="brand-mark" aria-hidden="true">
            Z
          </span>
          <span>
            <span className="brand-name">{siteConfig.name}</span>
            <span className="brand-tagline">Meet the wild</span>
          </span>
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="nav-list">
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <Link className="nav-link" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
