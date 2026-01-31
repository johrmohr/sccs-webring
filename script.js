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
 * Initialize the horizontal ring scroller with vertical-to-horizontal scroll
 * Activates when user scrolls to the bottom of the page
 * Creates illusion of a loop with ghost items on either end
 */
function initRingScroller() {
    const ringTrack = document.getElementById('ring-track');
    const ringSection = document.getElementById('ring-section');
    const scrollContainer = document.getElementById('ring-scroll-container');

    if (!ringTrack || !scrollContainer) return;

    // Build the ring nodes with ghost items for loop illusion
    buildRingNodes(ringTrack);

    let horizontalOffset = 0;
    let maxHorizontalScroll = 0;
    let initialOffset = 0;

    // Wait for render then set up scroll
    requestAnimationFrame(() => {
        setupScrollConversion();
        // Apply initial offset to center the first real item
        ringTrack.style.transform = `translateX(${-initialOffset}px)`;
        horizontalOffset = initialOffset;
        // Apply initial curve effect
        applyCurveEffect();
    });

    function setupScrollConversion() {
        const viewportWidth = window.innerWidth;
        const nodes = ringTrack.querySelectorAll('.ring-node:not(.ghost-node)');

        if (nodes.length === 0) return;

        // Get the first real site to center it
        const firstRealNode = nodes[0];
        const firstSite = firstRealNode.querySelector('.ring-site');
        const firstSiteOffset = firstRealNode.offsetLeft;
        const firstSiteWidth = firstSite.offsetWidth;

        // Initial offset: position first site box in center of viewport
        initialOffset = firstSiteOffset - (viewportWidth / 2) + (firstSiteWidth / 2);

        // Get the last real site
        const lastRealNode = nodes[nodes.length - 1];
        const lastSite = lastRealNode.querySelector('.ring-site');
        const lastSiteOffset = lastRealNode.offsetLeft;
        const lastSiteWidth = lastSite.offsetWidth;

        // Max scroll: position last site box in center of viewport
        const finalOffset = lastSiteOffset - (viewportWidth / 2) + (lastSiteWidth / 2);

        maxHorizontalScroll = finalOffset;
    }

    function isAtPageBottom() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        return scrollTop + clientHeight >= scrollHeight - 5;
    }

    /**
     * Apply 2D curve effect - cards tilt and drop to follow a circular arc
     * Calculated based on fixed positions, not pixel measurements
     */
    function applyCurveEffect() {
        const nodes = ringTrack.querySelectorAll('.ring-node');
        const maxRotation = 30; // Maximum tilt in degrees at edges
        const maxDrop = 220; // Maximum vertical drop in pixels at edges
        const visibleRadius = 3; // How many nodes from center before max effect

        // Calculate which node index is currently centered
        const scrollProgress = (horizontalOffset - initialOffset) / (maxHorizontalScroll - initialOffset || 1);
        const totalRealNodes = siteData.sites.length;
        const numGhostBefore = Math.min(4, totalRealNodes);

        // Current centered node index (in the full array including ghosts)
        const centeredIndex = numGhostBefore + (scrollProgress * (totalRealNodes - 1));

        nodes.forEach((node, index) => {
            // Distance from centered position (in node units)
            const distanceFromCenter = index - centeredIndex;

            // Normalize to -1 to 1 range based on visible radius
            const normalizedDistance = Math.max(-1, Math.min(1, distanceFromCenter / visibleRadius));

            // Calculate 2D rotation - left cards tilt counterclockwise, right cards tilt clockwise
            const rotation = normalizedDistance * maxRotation;

            // Calculate vertical drop - follows a circular arc
            const drop = normalizedDistance * normalizedDistance * maxDrop;

            // Apply rotation and vertical translation to entire node (card + connector)
            node.style.transform = `translateY(${drop}px) rotate(${rotation}deg)`;
        });
    }

    // Use wheel event to control horizontal scroll when at the bottom of the page
    window.addEventListener('wheel', (e) => {
        const scrollingDown = e.deltaY > 0;
        const scrollingUp = e.deltaY < 0;
        const atStart = horizontalOffset <= initialOffset;
        const atEnd = horizontalOffset >= maxHorizontalScroll;
        const atBottom = isAtPageBottom();

        // Activate horizontal scroll when:
        // 1. At bottom of page and scrolling down (start horizontal scroll)
        // 2. Already past initial position and scrolling
        if ((atBottom && scrollingDown && !atEnd) ||
            (horizontalOffset > initialOffset && scrollingUp) ||
            (horizontalOffset > initialOffset && scrollingDown && !atEnd)) {

            e.preventDefault();

            horizontalOffset += e.deltaY;
            horizontalOffset = Math.max(initialOffset, Math.min(maxHorizontalScroll, horizontalOffset));

            ringTrack.style.transform = `translateX(${-horizontalOffset}px)`;
            applyCurveEffect();
        }
    }, { passive: false });

    // Redraw on resize
    window.addEventListener('resize', () => {
        setupScrollConversion();
        // Re-apply current offset clamped to new bounds
        horizontalOffset = Math.max(initialOffset, Math.min(maxHorizontalScroll, horizontalOffset));
        ringTrack.style.transform = `translateX(${-horizontalOffset}px)`;
        applyCurveEffect();
    });

    // Click to visit site (works for both real and ghost nodes)
    ringTrack.addEventListener('click', (e) => {
        const siteEl = e.target.closest('.ring-site');
        if (siteEl && siteEl.dataset.url) {
            window.open(siteEl.dataset.url, '_blank');
        }
    });
}

/**
 * Build the ring nodes with ghost items at start and end for loop illusion
 */
function buildRingNodes(container) {
    const sites = siteData.sites;
    const numGhostItems = Math.min(4, sites.length); // Show up to 4 ghost items on each side

    // Create ghost nodes at the beginning (showing end of list)
    for (let i = numGhostItems; i > 0; i--) {
        const siteIndex = sites.length - i;
        const site = sites[siteIndex];
        const node = createRingNode(site, true, 'ghost-before');
        container.appendChild(node);
    }

    // Create real nodes
    sites.forEach((site, index) => {
        const node = createRingNode(site, false);
        container.appendChild(node);
    });

    // Create ghost nodes at the end (showing beginning of list)
    for (let i = 0; i < numGhostItems; i++) {
        const site = sites[i];
        const node = createRingNode(site, true, 'ghost-after');
        container.appendChild(node);
    }
}

/**
 * Create a single ring node element
 */
function createRingNode(site, isGhost, ghostClass = '') {
    const node = document.createElement('div');
    node.className = 'ring-node' + (isGhost ? ' ghost-node ' + ghostClass : '');

    const displayUrl = formatUrl(site.website);

    node.innerHTML = `
        <div class="ring-site" data-url="${site.website}">
            <span class="site-name">${site.name}</span>
            <span class="site-url">${displayUrl}</span>
        </div>
        <div class="ring-connector"></div>
    `;

    return node;
}
