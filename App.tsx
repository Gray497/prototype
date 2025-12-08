import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { SettingsView } from "./components/views/SettingsView";
import { CustomersView } from "./components/views/CustomersView";
import { ArticlesView } from "./components/views/ArticlesView";
import { ArticleDetailView } from "./components/views/ArticleDetailView";
import { OrdersView } from "./components/views/OrdersView";
import { OrderDetailView } from "./components/views/OrderDetailView";
import { ProductsView } from "./components/views/ProductsView";
import { ProductDetailView } from "./components/views/ProductDetailView";
import { SitesView } from "./components/views/SitesView";
import { SiteDetailView } from "./components/views/SiteDetail";
import { PricesView } from "./components/views/PricesView";
import { SiteTemplatesView } from "./components/views/SiteTemplatesView";
import { SiteTemplateDetailView } from "./components/views/SiteTemplateDetailView";
// 内容管理
import { TagsView } from "./components/views/TagsView";
// 玄学模块
import { LeadsView } from "./components/views/LeadsView";
// 系统管理
import { UsersView } from "./components/views/UsersView";
import { RolesView } from "./components/views/RolesView";
import { BrandOwnersView } from "./components/views/BrandOwnersView";
import { Order, initialOrders } from "./data";

// 路由类型定义
interface Route {
  view: string;
  id?: string;
}

// 解析路由
const parseRoute = (path: string): Route => {
  const parts = path.split("/").filter(Boolean);
  if (parts.length >= 2) {
    return { view: parts[0], id: parts[1] };
  }
  return { view: parts[0] || "orders" };
};

// 构建路由路径
const buildRoute = (view: string, id?: string): string => {
  return id ? `${view}/${id}` : view;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<Route>({ view: "orders" });
  const [isDark, setIsDark] = useState(false);
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  // 导航函数
  const navigate = (path: string) => {
    setCurrentRoute(parseRoute(path));
  };

  // 兼容旧的 setCurrentView 调用
  const setCurrentView = (view: string) => {
    setCurrentRoute({ view });
  };

  useEffect(() => {
    // Check system preference or localStorage
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      if (newTheme) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newTheme;
    });
  };

  const renderView = () => {
    const { view, id } = currentRoute;

    switch (view) {
      case "settings":
        return <SettingsView />;
      case "customers":
        return <CustomersView />;
      case "articles":
        // 如果有 id 参数，显示文章详情/编辑页
        if (id) {
          return <ArticleDetailView articleId={id} onNavigate={navigate} />;
        }
        return <ArticlesView onNavigate={navigate} />;
      case "orders":
        if (id) {
          return (
            <OrderDetailView
              orderId={id}
              orders={orders}
              onUpdateOrders={setOrders}
              onNavigate={navigate}
            />
          );
        }
        return <OrdersView orders={orders} onNavigate={navigate} />;
      case "products":
        // 如果 id 是订单编号，复用 products/:id 路由展示订单详情
        if (id?.startsWith("ORD-")) {
          return (
            <OrderDetailView
              orderId={id}
              orders={orders}
              onUpdateOrders={setOrders}
              onNavigate={navigate}
            />
          );
        }
        // 产品详情
        if (id) {
          return <ProductDetailView productId={id} onNavigate={navigate} />;
        }
        // 产品列表
        return <ProductsView onNavigate={navigate} />;
      case "sites":
        // 如果有 id 参数，显示站点详情页
        if (id) {
          return <SiteDetailView siteId={id} onNavigate={navigate} />;
        }
        return <SitesView onNavigate={navigate} />;
      case "prices":
        return <PricesView />;
      case "templates":
        // 如果有 id 参数，显示模板编辑页
        if (id) {
          return (
            <SiteTemplateDetailView templateId={id} onNavigate={navigate} />
          );
        }
        return <SiteTemplatesView onNavigate={navigate} />;
      // 内容管理
      case "tags":
        return <TagsView />;
      case "brands":
        return <BrandOwnersView />;
      // 玄学模块
      case "leads":
        return <LeadsView />;
      // 系统管理
      case "users":
        return <UsersView />;
      case "roles":
        return <RolesView />;
      default:
        return (
          <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center">
            <div className="text-4xl font-bold text-muted-foreground/30">
              开发中
            </div>
            <p className="text-muted-foreground">该页面 ({view}) 尚未实现。</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans antialiased">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentView={currentRoute.view}
        onChangeView={setCurrentView}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;
