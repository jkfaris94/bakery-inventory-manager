import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function NavBar() {
  const navRef = useRef(null);
  const collapseRef = useRef(null);
  const location = useLocation();
  const [expandedSubmenus, setExpandedSubmenus] = useState(new Set());
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile vs desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const links = [
    { to: '/', label: 'Home', end: true },
    { 
      to: '/ingredients', 
      label: 'Ingredients',
      submenu: [
        { to: '/ingredients/new', label: 'New Ingredient' }
      ]
    },
    { 
      to: '/recipes', 
      label: 'Recipes',
      submenu: [
        { to: '/recipes/new', label: 'New Recipe' }
      ]
    },
    { to: '/baked_goods', label: 'Baked Goods' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside the navbar
      if (navRef.current && !navRef.current.contains(event.target)) {
        const collapseElement = collapseRef.current;
        if (collapseElement && collapseElement.classList.contains('show')) {
          // Try to use Bootstrap's Collapse API if available
          const Bootstrap = window.bootstrap;
          if (Bootstrap && Bootstrap.Collapse) {
            const bsCollapse = Bootstrap.Collapse.getInstance(collapseElement);
            if (bsCollapse) {
              bsCollapse.hide();
            } else {
              // Fallback: manually remove the show class
              collapseElement.classList.remove('show');
            }
          } else {
            // Fallback: manually remove the show class
            collapseElement.classList.remove('show');
            // Also update the aria-expanded attribute on the toggler
            const toggler = navRef.current?.querySelector('.navbar-toggler');
            if (toggler) {
              toggler.setAttribute('aria-expanded', 'false');
            }
          }
        }
        // Close all submenus when clicking outside
        setExpandedSubmenus(new Set());
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const toggleSubmenu = (linkTo) => {
    setExpandedSubmenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(linkTo)) {
        newSet.delete(linkTo);
      } else {
        newSet.add(linkTo);
      }
      return newSet;
    });
  };

  const handleParentLinkClick = (e, link) => {
    // On desktop, allow navigation - hover handles submenu
    // On mobile, allow navigation - chevron will handle expansion
    if (!link.submenu) {
      // Regular link - close navbar on mobile
      handleNavLinkClick();
    }
    // If it has a submenu, allow navigation to parent page
  };

  const handleSubmenuToggle = (e, link) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSubmenu(link.to);
  };

  const handleParentKeyDown = (e, link) => {
    if (link.submenu) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSubmenu(link.to);
      } else if (e.key === 'Escape') {
        setExpandedSubmenus(prev => {
          const newSet = new Set(prev);
          newSet.delete(link.to);
          return newSet;
        });
      }
    }
  };

  const handleSubmenuLinkClick = () => {
    // Close navbar and submenus when submenu link is clicked
    handleNavLinkClick();
    setExpandedSubmenus(new Set());
  };

  const handleNavLinkClick = () => {
    // Close navbar when a nav link is clicked (mobile UX)
    const collapseElement = collapseRef.current;
    if (collapseElement && collapseElement.classList.contains('show')) {
      const Bootstrap = window.bootstrap;
      if (Bootstrap && Bootstrap.Collapse) {
        const bsCollapse = Bootstrap.Collapse.getInstance(collapseElement);
        if (bsCollapse) {
          bsCollapse.hide();
        } else {
          collapseElement.classList.remove('show');
        }
      } else {
        collapseElement.classList.remove('show');
        const toggler = navRef.current?.querySelector('.navbar-toggler');
        if (toggler) {
          toggler.setAttribute('aria-expanded', 'false');
        }
      }
    }
  };

  return (
    <div className="container">
      <nav ref={navRef} className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid px-0">
          <NavLink
            to="/"
            className="navbar-brand"
            onClick={handleNavLinkClick}
          >
            MFBG
          </NavLink>
          <button
            className="navbar-toggler navbar-toggler-white"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon navbar-toggler-icon-white" />
          </button>
          <div ref={collapseRef} className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto">
              {links.map((link) => {
                const hasSubmenu = link.submenu && link.submenu.length > 0;
                const isExpanded = expandedSubmenus.has(link.to);
                const isActive = link.submenu 
                  ? link.submenu.some(sub => location.pathname === sub.to)
                  : false;

                return (
                  <li 
                    className={`nav-item ${hasSubmenu ? 'nav-item-dropdown' : ''} ${isExpanded ? 'submenu-expanded' : ''}`} 
                    key={link.to}
                  >
                    <NavLink
                      to={link.to}
                      end={link.end}
                      className={({ isActive: navIsActive }) =>
                        `nav-link nav-link-white ${navIsActive || isActive ? ' active' : ''} ${hasSubmenu ? 'has-submenu' : ''}`
                      }
                      onClick={(e) => handleParentLinkClick(e, link)}
                      onKeyDown={(e) => handleParentKeyDown(e, link)}
                      aria-expanded={hasSubmenu ? isExpanded : undefined}
                      aria-haspopup={hasSubmenu ? 'true' : undefined}
                      role={hasSubmenu ? 'button' : undefined}
                      tabIndex={hasSubmenu ? 0 : undefined}
                    >
                      {link.label}
                      {hasSubmenu && (
                        <span 
                          className="submenu-indicator" 
                          aria-hidden="true"
                          onClick={(e) => handleSubmenuToggle(e, link)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleSubmenuToggle(e, link);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={`Toggle ${link.label} submenu`}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      )}
                    </NavLink>
                    {hasSubmenu && (
                      <ul 
                        className={`submenu ${isExpanded ? 'show' : ''}`}
                        role="menu"
                        aria-label={`${link.label} submenu`}
                      >
                        {link.submenu.map((subLink) => (
                          <li key={subLink.to} role="none">
                            <NavLink
                              to={subLink.to}
                              className={({ isActive }) =>
                                `nav-link submenu-link nav-link-white ${isActive ? ' active' : ''}`
                              }
                              onClick={handleSubmenuLinkClick}
                              role="menuitem"
                            >
                              {subLink.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
