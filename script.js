document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    const urlInput = document.getElementById('urlInput');
    const successOverlay = document.getElementById('successOverlay');

    function cleanUrl(url) {
        const urlObj = new URL(url);
        
        if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
            const videoId = urlObj.searchParams.get('v');
            urlObj.search = videoId ? `?v=${videoId}` : '';
            return urlObj.toString();
        }
        
        return `${urlObj.origin}${urlObj.pathname}`;
    }

    function showSuccess() {
        showSuccessOverlay();
        urlInput.value = '';
    }

    function showSuccessOverlay() {
        const overlay = document.getElementById('successOverlay');
        overlay.classList.remove('hidden');
        // Trigger fade in
        requestAnimationFrame(() => overlay.classList.remove('opacity-0'));
        
        setTimeout(() => {
            // Fade out
            overlay.classList.add('opacity-0');
            // Hide after fade completes
            setTimeout(() => overlay.classList.add('hidden'), 200);
        }, 1500);
    }

    urlInput.addEventListener('paste', async (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text');
        
        try {
            const cleaned = cleanUrl(paste);
            await navigator.clipboard.writeText(cleaned);
            showSuccess();
        } catch (err) {
            urlInput.classList.add('border-red-500', 'animate-shake');
            setTimeout(() => urlInput.classList.remove('border-red-500', 'animate-shake'), 750);
        }
    });

    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        }
    });

    const infoButton = document.getElementById('infoButton');
    const infoModal = document.getElementById('infoModal');
    const closeInfoButton = document.getElementById('closeInfoButton');
    
    function toggleModal() {
        const modal = document.getElementById('infoModal');
        const modalContent = modal.querySelector('div');
        
        if (modal.classList.contains('opacity-0')) {
            modal.classList.remove('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                modalContent.classList.remove('scale-95', 'opacity-0');
            }, 10);
        } else {
            modalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                modal.classList.add('opacity-0', 'pointer-events-none');
            }, 200);
        }
    }

    infoButton.addEventListener('click', toggleModal);
    closeInfoButton.addEventListener('click', toggleModal);
    infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) toggleModal();
    });
});