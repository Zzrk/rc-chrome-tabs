// @ts-ignore
import ChromeTabs from 'chrome-tabs';
import React, { useEffect } from 'react';
import 'chrome-tabs/css/chrome-tabs.css';
import 'chrome-tabs/css/chrome-tabs-dark-theme.css';
import './index.css';

type ChromeTabInfo = {
  title: string;
  favicon: string | false;
  id: string;
  active?: boolean;
}

export type ChromeTabsProps = {
  tabs: ChromeTabInfo[];
  onChange: (tabs: ChromeTabsProps['tabs'] | ((tabs: ChromeTabsProps['tabs']) => ChromeTabsProps['tabs'])) => void;
  onLoad?: (controller: ChromeTabsController) => void;
  children?: React.ReactNode;
}

export type ChromeTabsController = {
  addTab: (tab: ChromeTabInfo) => void;
  addBackgroundTab: (tab: ChromeTabInfo) => void;
  removeTab: () => void;
  toggleTheme: () => void;
}

const RCChromeTabs = ({ tabs, onChange, children, onLoad }: ChromeTabsProps) => {
  let newTab: ChromeTabInfo | null = null;

  // 激活中tab切换
  const handleActiveTabChange = ({ detail }: any) => {
    const id = detail.tabEl.getAttribute('data-tab-id');
    onChange(prev => prev.map(tab => ({
      ...tab,
      active: tab.id === id
    })));
  }

  // 添加tab
  const handleTabAdd = () => {
    if (!newTab) return;
    const isActive = !!newTab.active;
    onChange(prev => [...prev.map(tab => ({
      ...tab, active: isActive ? false : tab.active
    })), newTab!]);
  }

  // 移除tab
  const handleTabRemove = ({ detail }: any) => {
    const id = detail.tabEl.getAttribute('data-tab-id');
    onChange(prev => prev.filter(tab => tab.id !== id));
  }

  // tab重新排序
  const handleTabReorder = ({ detail }: any) => {
    const { originIndex, destinationIndex } = detail;
    onChange(prev => {
      [prev[originIndex], prev[destinationIndex]] = [prev[destinationIndex], prev[originIndex]];
      return prev;
    })
  }

  // 初始化active
  const initActive = () => {
    const tab = tabs.find(tab => !!tab.active);
    if (!tab) return;
    const el = document.querySelector(`.chrome-tab[data-tab-id="${tab?.id}"]`);
    if (!el) return;
    el.setAttribute('active', 'true');
  }

  useEffect(() => {
    const el = document.querySelector('.chrome-tabs');
    if (!el) return;

    // 初始化chromeTabs
    const chromeTabs = new ChromeTabs();
    chromeTabs.init(el);

    // 逐一添加tab
    tabs.map(tab => {
      chromeTabs.addTab(tab, { background: true });
    })
    initActive();

    onLoad && onLoad({
      addTab: (tab) => {
        newTab = tab;
        chromeTabs.addTab(newTab);
      },
      addBackgroundTab: (tab) => {
        newTab = tab;
        chromeTabs.addTab(newTab, { background: true });
      },
      removeTab: () => chromeTabs.removeTab(chromeTabs.activeTabEl),
      toggleTheme: () => {
        if (!el) return;
        if (el.classList.contains('chrome-tabs-dark-theme')) {
          document.documentElement.classList.remove('dark-theme');
          el.classList.remove('chrome-tabs-dark-theme');
        } else {
          document.documentElement.classList.add('dark-theme');
          el.classList.add('chrome-tabs-dark-theme');
        }
      }
    })

    el.addEventListener('tabAdd', handleTabAdd);
    el.addEventListener('activeTabChange', handleActiveTabChange);
    el.addEventListener('tabRemove', handleTabRemove);
    el.addEventListener('tabReorder', handleTabReorder);

    return () => {
      const el = document.querySelector('.chrome-tabs');
      if (!el) return;
      el.removeEventListener('tabAdd', handleTabAdd);
      el.removeEventListener('activeTabChange', handleActiveTabChange);
      el.removeEventListener('tabRemove', handleTabRemove);
      el.removeEventListener('tabReorder', handleTabReorder);
    }
  }, [])

  return (
    <div className="mock-browser">
      <div className="chrome-tabs">
        <div className="chrome-tabs-content">
        </div>
        <div className="chrome-tabs-bottom-bar"></div>
      </div>
      <div className="chrome-tabs-optional-shadow-below-bottom-bar"></div>
      <div className="mock-browser-content">
        {children}
      </div>
    </div>
  )
}

export default RCChromeTabs;