# Performance

Target smooth presentation on modern teacher laptops, approximately 60 FPS for ordinary scenes.

Avoid:

- pushing 60 FPS simulation state through React
- unnecessary per-frame allocation
- uncontrolled particle counts
- excessive draw calls
- giant textures
- memory leaks

Optimization should be measured. Do not sacrifice scientific correctness for frame rate.
