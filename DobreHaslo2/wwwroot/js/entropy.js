(function () {
    // Simple entropy collector that mixes mouse movement into a pool
    window.entropy = (function () {
        const neededBits = 32768; // increased
        const neededBytes = neededBits / 8;
        let pool = new Uint8Array(0);
        let listening = false;
        let mouseHandler = null;
        let counter = 0;

        function appendBytes(bytes) {
            const newPool = new Uint8Array(pool.length + bytes.length);
            newPool.set(pool, 0);
            newPool.set(bytes, pool.length);
            pool = newPool;
        }

        async function addMouseEntropy(e) {
            // take timestamp and coordinates
            const txt = `${e.timeStamp}:${e.clientX}:${e.clientY}:${Math.random()}:${counter++}`;
            const enc = new TextEncoder().encode(txt);
            const hashBuf = await crypto.subtle.digest('SHA-256', enc);
            appendBytes(new Uint8Array(hashBuf));
            // keep pool trimmed to some reasonable size (e.g., last neededBytes*2)
            const maxPool = Math.max(4096, neededBytes * 2);
            if (pool.length > maxPool) pool = pool.slice(pool.length - maxPool);
        }

        function start() {
            if (listening) return;
            mouseHandler = (e) => addMouseEntropy(e);
            window.addEventListener('mousemove', mouseHandler);
            window.addEventListener('touchmove', mouseHandler);
            listening = true;
        }

        function stop() {
            if (!listening) return;
            window.removeEventListener('mousemove', mouseHandler);
            window.removeEventListener('touchmove', mouseHandler);
            listening = false;
        }

        function progress() {
            return Math.min(1, pool.length / neededBytes);
        }

        // produce cryptographically strong bytes mixed with collected pool
        // returns base64 string
        async function getRandomBytesBase64(len) {
            if (len <= 0) return '';
            // get crypto secure random
            const rnd = new Uint8Array(len);
            crypto.getRandomValues(rnd);

            // if we don't have any pool bytes yet, just return rnd
            if (pool.length === 0) {
                return arrayBufferToBase64(rnd.buffer);
            }

            // generate keystream by hashing pool + counter
            let out = new Uint8Array(len);
            let generated = 0;
            let ctr = 0;
            while (generated < len) {
                const toHash = new Uint8Array(pool.length + 4);
                toHash.set(pool, 0);
                // append counter
                toHash[toHash.length - 4] = (ctr >>> 24) & 0xff;
                toHash[toHash.length - 3] = (ctr >>> 16) & 0xff;
                toHash[toHash.length - 2] = (ctr >>> 8) & 0xff;
                toHash[toHash.length - 1] = (ctr >>> 0) & 0xff;
                const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', toHash));
                const take = Math.min(digest.length, len - generated);
                out.set(digest.subarray(0, take), generated);
                generated += take;
                ctr++;
            }

            // mix out with rnd via XOR
            for (let i = 0; i < len; i++) {
                out[i] = out[i] ^ rnd[i];
            }

            return arrayBufferToBase64(out.buffer);
        }

        function arrayBufferToBase64(buffer) {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            const chunkSize = 0x8000;
            for (let i = 0; i < bytes.length; i += chunkSize) {
                const slice = bytes.subarray(i, i + chunkSize);
                binary += String.fromCharCode.apply(null, slice);
            }
            return btoa(binary);
        }

        return {
            start: start,
            stop: stop,
            progress: progress,
            getRandomBytesBase64: getRandomBytesBase64,
            neededBits: neededBits
        };
    })();
})();
