import React from 'react';
import DummyWidget from './Widgets/DummyWidget';

const AccountPage = () => (
  <div className="nd-widget-container">
    <div className="col col-3 col-sm-4">
      <DummyWidget />
    </div>
    <div className="col col-1 col-sm-4">
      <DummyWidget />
    </div>
    <div className="col col-1 col-sm-4"><DummyWidget /></div>
    <div className="col col-1 col-sm-4"><DummyWidget /></div>
    <div className="col col-1 col-sm-4"><DummyWidget /></div>
    <div className="col col-2 col-sm-4">
      <div className="col col-2 col-sm-4"><DummyWidget /></div>
      <div className="col col-2 col-sm-4"><DummyWidget /></div>
    </div>
    <div className="col col-2 col-sm-4"><DummyWidget /></div>
  </div>
);

export default AccountPage;
