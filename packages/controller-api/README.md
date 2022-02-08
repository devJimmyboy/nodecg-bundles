# NodeCG-Parcel

### A template repo for making [NodeCG](https://nodecg.dev) Bundles with [Parcel v1](https://parceljs.org) **AND** the _newer_ [Parcel V2](https://v2.parceljs.org)

</br>

It works with most NodeCG versions since Parcel doesn't rely on it, but the current configuration **_is_** set up for the latest NodeCG versions.

## Usage

To use this repository to template a bundle, you can use [NodeCG's CLI](https://github.com/nodecg/nodecg-cli) _(documented [here](#usage-cli))_ or you can simply [clone the repo](#usage-repo)

<h3 id="usage-cli">NodeCG CLI</h3>

First, install Nodecg-cli using the package manager of your choice:

```zsh
npm install -g nodecg-cli
```

or

```zsh
yarn global add nodecg-cli
```

Next, make sure you're in the root of your NodeCG installation, and install this repo as a bundle using nodecg-cli:

```zsh
nodecg install devJimmyboy/nodecg-parcel-template
```
