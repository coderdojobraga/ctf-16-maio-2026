// Server component — comment below is rendered in initial HTML (visible via Ctrl+U / view-source:)
/* eslint-disable react/no-danger */

import ChampionPanel from '@/components/ChampionPanel';

export default function ChampionPage() {
  return (
    <>
      {/* This div renders server-side so the comment appears in view-source */}
      <div
        dangerouslySetInnerHTML={{
          __html: '<!-- CHAMPION ACCESS: password="NINJA-HACKER" -->',
        }}
      />
      <ChampionPanel />
    </>
  );
}
