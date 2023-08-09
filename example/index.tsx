import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { v4 } from 'uuid';
import ChromeTabs, { ChromeTabsProps, ChromeTabsController } from '../.';
import './index.css';

const App = () => {
  const [tabs, setTabs] = React.useState<ChromeTabsProps['tabs']>([
    {
      title: 'Google',
      favicon: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.FnzI6eBMBS9n8VL7Wy39mAHaHa?pid=ImgDet&rs=1',
      id: v4(),
      active: true
    },
    {
      title: 'Facebook',
      favicon: 'https://s0.60logo.com/uploads/items/images/170627/1-1f62g95q13a.svg',
      id: v4()
    }
  ])
  const controller = React.useRef<ChromeTabsController>()

  return (
    <div>
      <ChromeTabs tabs={tabs} onChange={setTabs} onLoad={_controller => controller.current = _controller}>
        <div className="buttons">
          <button data-theme-toggle onClick={() => controller.current?.toggleTheme()}>Toggle dark theme</button>
          <button data-add-tab onClick={() => controller.current?.addTab?.({ ...tabs[0], id: v4(), active: true })}>Add new tab</button>
          <button data-add-background-tab onClick={() => controller.current?.addBackgroundTab?.({ ...tabs[0], id: v4() })}>Add tab in the background</button>
          <button data-remove-tab onClick={() => controller.current?.removeTab?.()}>Remove active tab</button>
          <button onClick={() => console.log(tabs)}>console</button>
        </div>
      </ChromeTabs>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
