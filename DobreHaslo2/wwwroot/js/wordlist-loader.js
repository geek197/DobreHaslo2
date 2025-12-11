window.fetchWordListWithEncodingFallback = async function (url) {
    try {
        const resp = await fetch(url, { cache: 'no-cache' });
        if (!resp.ok) return null;
        const buffer = await resp.arrayBuffer();
        // Try UTF-8
        try {
            const utf8Decoder = new TextDecoder('utf-8', { fatal: false });
            let text = utf8Decoder.decode(buffer);
            if (text.indexOf('\uFFFD') === -1) {
                return text;
            }
        } catch (e) {
            // ignore
        }
        // Fallback to windows-1250 (Central European)
        try {
            const cpDecoder = new TextDecoder('windows-1250', { fatal: false });
            let text2 = cpDecoder.decode(buffer);
            return text2;
        } catch (e) {
            // final fallback: decode as utf-8 without fatal
            const utf8Decoder2 = new TextDecoder('utf-8');
            return utf8Decoder2.decode(buffer);
        }
    } catch (e) {
        return null;
    }
};