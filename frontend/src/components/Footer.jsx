import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white text-sm px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {/* Column 1 */}
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="space-y-1">
              <li>About</li>
              <li>Career</li>
              <li>Blog</li>
              <li>Press</li>
              <li>Contact</li>
              <li>Bug Bounty</li>
              <li>Sitemap</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-semibold mb-2">Help & Support</h4>
            <ul className="space-y-1">
              <li>Home</li>
              <li>Mobile Apps</li>
              <li>Payment Options</li>
              <li>FAQ</li>
              <li>Support</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-semibold mb-2">Become a Partner</h4>
            <ul className="space-y-1">
              <li>Policies</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Refund Policy</li>
              <li>Grievance Policy</li>
            </ul>
          </div>

          {/* Column 4 (only visible in desktop) */}
          <div className="hidden md:block">
            <h4 className="font-semibold mb-2">Connect Us</h4>
            {/* Placeholder or extra content */}
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-xs text-gray-400">
            ©2025 Payyou Inc. | All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
