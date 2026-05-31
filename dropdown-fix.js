// Dropdown Fix - Works Properly
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('button');
        const content = dropdown.querySelector('.dropdown-content');
        let timeout;
        let isHovering = false;
        
        function showDropdown() {
            isHovering = true;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (isHovering && content) {
                    content.style.opacity = '1';
                    content.style.visibility = 'visible';
                    content.style.pointerEvents = 'auto';
                    content.style.transform = 'translateY(0)';
                }
            }, 250);
        }
        
        function hideDropdown() {
            isHovering = false;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (!isHovering && content) {
                    content.style.opacity = '0';
                    content.style.visibility = 'hidden';
                    content.style.pointerEvents = 'none';
                    content.style.transform = 'translateY(-8px)';
                }
            }, 200);
        }
        
        dropdown.addEventListener('mouseenter', showDropdown);
        dropdown.addEventListener('mouseleave', hideDropdown);
        
        if (content) {
            content.addEventListener('mouseenter', () => {
                isHovering = true;
                clearTimeout(timeout);
            });
            content.addEventListener('mouseleave', hideDropdown);
        }
        
        // Sub-dropdowns
        const subDropdowns = dropdown.querySelectorAll('.dropdown-content .dropdown');
        subDropdowns.forEach(subDropdown => {
            const subButton = subDropdown.querySelector('a');
            const subContent = subDropdown.querySelector('.dropdown-content');
            let subTimeout;
            let subIsHovering = false;
            
            function showSubDropdown() {
                subIsHovering = true;
                clearTimeout(subTimeout);
                subTimeout = setTimeout(() => {
                    if (subIsHovering && subContent) {
                        subContent.style.opacity = '1';
                        subContent.style.visibility = 'visible';
                        subContent.style.pointerEvents = 'auto';
                        subContent.style.transform = 'translateX(0)';
                    }
                }, 300);
            }
            
            function hideSubDropdown() {
                subIsHovering = false;
                clearTimeout(subTimeout);
                subTimeout = setTimeout(() => {
                    if (!subIsHovering && subContent) {
                        subContent.style.opacity = '0';
                        subContent.style.visibility = 'hidden';
                        subContent.style.pointerEvents = 'none';
                        subContent.style.transform = 'translateX(-4px)';
                    }
                }, 250);
            }
            
            if (subButton) {
                subButton.addEventListener('mouseenter', showSubDropdown);
                subButton.addEventListener('mouseleave', hideSubDropdown);
            }
            
            if (subContent) {
                subContent.addEventListener('mouseenter', () => {
                    subIsHovering = true;
                    clearTimeout(subTimeout);
                });
                subContent.addEventListener('mouseleave', hideSubDropdown);
            }
        });
    });
});
