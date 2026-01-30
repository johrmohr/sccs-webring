// Main script for the webring homepage

document.addEventListener('DOMContentLoaded', function() {
    // First, check if this is a navigation request (prev/next)
    if (navigateWebring()) {
        return; // Navigation in progress, don't render homepage
    }

    // Render the member list
    renderMembers();

    // Update site count
    updateSiteCount();

    // Initialize the horizontal ring scroller
    initRingScroller();
});

/**
 * Renders the list of webring members
 */
function renderMembers() {
    const memberList = document.getElementById('member-list');
    if (!memberList) return;

    const sites = siteData.sites;

    sites.forEach(site => {
        const row = document.createElement('div');
        row.className = 'member-row';

        const displayUrl = formatUrl(site.website);

        row.innerHTML = `
            <span class="name">${site.name}</span>
            <span class="year">${site.year}</span>
            <span class="url"><a href="${site.website}" target="_blank" rel="noopener">${displayUrl}</a></span>
        `;

        memberList.appendChild(row);
    });
}

/**
 * Updates the site counter in the footer
 */
function updateSiteCount() {
    const countEl = document.getElementById('site-count');
    if (countEl) {
        countEl.textContent = siteData.sites.length;
    }
}

/**
 * Initialize the horizontal ring scroller
 */
function initRingScroller() {
    const ringTrack = document.getElementById('ring-track');
    const loopPath = document.getElementById('loop-path');
    const svg = document.getElementById('ring-loop-connector');

    if (!ringTrack) return;

    // Build the ring nodes
    buildRingNodes(ringTrack);

    // Draw the loop connector after render
    requestAnimationFrame(() => {
        drawLoopConnector(ringTrack, loopPath, svg);
    });

    // Redraw on resize
    window.addEventListener('resize', () => {
        drawLoopConnector(ringTrack, loopPath, svg);
    });

    // Redraw on scroll
    const ringContainer = document.querySelector('.ring-container');
    if (ringContainer) {
        ringContainer.addEventListener('scroll', () => {
            drawLoopConnector(ringTrack, loopPath, svg);
        });
    }

    // Click to visit site
    ringTrack.addEventListener('click', (e) => {
        const siteEl = e.target.closest('.ring-site');
        if (siteEl && siteEl.dataset.url) {
            window.open(siteEl.dataset.url, '_blank');
        }
    });
}

/**
 * Draw the SVG path that connects last site back to first (underneath)
 */
function drawLoopConnector(track, path, svg) {
    if (!path || !svg) return;

    const nodes = track.querySelectorAll('.ring-node');
    if (nodes.length < 2) {
        path.setAttribute('d', '');
        return;
    }

    const firstNode = nodes[0];
    const lastNode = nodes[nodes.length - 1];

    const firstSite = firstNode.querySelector('.ring-site');
    const lastSite = lastNode.querySelector('.ring-site');

    if (!firstSite || !lastSite) return;

    const wrapper = document.querySelector('.ring-wrapper');
    const wrapperRect = wrapper.getBoundingClientRect();

    const firstRect = firstSite.getBoundingClientRect();
    const lastRect = lastSite.getBoundingClientRect();

    // Calculate positions relative to wrapper
    const firstX = firstRect.left - wrapperRect.left + firstRect.width / 2;
    const firstY = firstRect.bottom - wrapperRect.top;

    const lastX = lastRect.left - wrapperRect.left + lastRect.width / 2;
    const lastY = lastRect.bottom - wrapperRect.top;

    // Draw a path that goes down from the last node, across the bottom, and up to the first
    const dropDown = 50;
    const curveRadius = 20;

    const pathD = `
        M ${lastX} ${lastY}
        L ${lastX} ${lastY + dropDown - curveRadius}
        Q ${lastX} ${lastY + dropDown} ${lastX - curveRadius} ${lastY + dropDown}
        L ${firstX + curveRadius} ${lastY + dropDown}
        Q ${firstX} ${lastY + dropDown} ${firstX} ${lastY + dropDown - curveRadius}
        L ${firstX} ${firstY}
    `;

    path.setAttribute('d', pathD);

    // Update SVG size
    svg.style.height = (lastY + dropDown + 20) + 'px';
}

/**
 * Build the ring nodes
 */
function buildRingNodes(container) {
    const sites = siteData.sites;

    sites.forEach((site, index) => {
        const node = document.createElement('div');
        node.className = 'ring-node';

        const displayUrl = formatUrl(site.website);

        node.innerHTML = `
            <div class="ring-site" data-url="${site.website}">
                <span class="site-name">${site.name}</span>
                <span class="site-url">${displayUrl}</span>
            </div>
            <div class="ring-connector"></div>
        `;

        container.appendChild(node);
    });
}
