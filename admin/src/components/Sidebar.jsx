import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiPlusSquare,
  FiBox,
  FiTag,
  FiShoppingCart,
  FiUsers,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { assets } from "../assets/assets";

const navSections = [
  {
    title: "MAIN",
    links: [{ to: "/dashboard", label: "Dashboard", icon: FiHome }],
  },
  {
    title: "CATALOG",
    links: [
      { to: "/add", label: "Add Product", icon: FiPlusSquare },
      { to: "/list", label: "Products", icon: FiBox },
      { to: "/coupons", label: "Coupons", icon: FiTag },
      { to: "/Users", label: "Users", icon: FiUsers },
    ],
  },
  {
    title: "SALES",
    links: [{ to: "/order", label: "Orders", icon: FiShoppingCart }],
  },
 
];

const Sidebar = () => {
  return (
    <aside className="h-full bg-white border-r flex flex-col">
      {/* Brand (only for collapsed / mobile cases) */}
      <div className="h-16 flex items-center gap-2 px-6 border-b">
        <img
          src={assets.logo}
          alt="logo"
          className="h-16 sm:h-20 md:h-24 lg:h-28
                  w-auto object-contain
                  dark:brightness-125 dark:contrast-125 dark:saturate-125"
        />
       
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-400">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.links.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                      ${
                        isActive
                          ? "bg-green-600 text-white shadow-sm"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <Icon className="text-lg shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-xs text-gray-400">
        © {new Date().getFullYear()} Forever Foody
      </div>
    </aside>
  );
};

export default Sidebar;
