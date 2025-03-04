import { build } from 'esbuild';

try {
    await build({
        entryPoints: ['src/server.ts'],
        bundle: true,
        minify: true,
        sourcemap: true,
        platform: 'node',
        target: 'esnext',
        outfile: 'dist/server.js',
    });
}
catch (e) {
    console.error('Build failed:', e);
}
