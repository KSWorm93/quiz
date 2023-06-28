'use strict';

const rootProject = '/../..';

const directories = new function () {
    this.source = __dirname + rootProject + '/src';
    this.routes = this.source + '/routes';
    this.utilities = this.source + '/utilities';
    this.templates = this.source + '/templates';
    this.layouts = this.templates + '/layouts';
    this.partials = this.templates + '/partials';
    this.client = this.source + '/client';
    this.css = this.client + '/css';
    this.js = this.client + '/js';
};

module.exports = directories;
