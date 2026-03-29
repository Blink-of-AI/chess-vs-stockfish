# Changelog

## [0.3.0] - 2026-03-29

### Changed
- **Page background**: Switched from near-black (`#0C0C0C`) to warm off-white (`#edede8`) matching lichess light theme
- **Surface colors**: Panels now use white/light-grey (`#ffffff` / `#e0ddd8`) instead of dark greys
- **Text**: Updated to dark charcoal (`#2d2d2d`) and muted brown (`#766e65`) for legibility on light background
- **Accent**: Changed from gold (`#C8A951`) to lichess brown (`#b58863`) for consistency with the board
- **Board frame**: Lightened from dark walnut to medium walnut gradient matching the lighter UI
- **Last move highlight**: Updated to lichess's yellow-green (`rgba(155,199,0,0.41)`)
- **Buttons**: Color selector and controls updated to work correctly on light background

## [0.2.0] - 2026-03-29

### Changed
- **Board**: Replaced radial-gradient spotlight squares with flat classic chess colors (`#f0d9b5` light, `#b58863` dark) matching the lichess/classic aesthetic
- **Board frame**: Replaced thin border with thick padding-based dark walnut frame with multi-stop gradient for depth
- **Pieces**: Added radial gradient fills to all SVG pieces for a 3D rendered appearance — white pieces use ivory-to-gold gradient, black pieces use brown-to-near-black gradient

## [0.1.0] - Initial release

- Chess game vs Stockfish 16 (skill level 15)
- Drag and drop + click-to-move
- Game history saved to NeonDB
- ACPL analysis and ELO estimation post-game
