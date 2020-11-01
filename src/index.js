import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

const playerSessionParam = getUrlParameter('playerSession');

ReactDOM.render(<App playerSession={playerSessionParam} />, document.getElementById('root'));
