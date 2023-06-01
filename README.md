<div align="center">
    <img src="/assets/svolte_banner.png" alt="Svolte banner" width="60%"/>
</div>

# Overview

Svolte is an open source Chrome developer tool for time travel debugging and component hierarchy visualization in Svelte applications. Svolte enables developers to record snapshots of component states, visualize component props, inspect and jump between snapshots. Svolte is the first Svelte time travel debugger that is compatible with writable stores and includes a skip feature.

**Developed with**

[![Svelte](https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00)](#)
[![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![D3.js](https://img.shields.io/badge/d3.js-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
[![Google Chrome](https://img.shields.io/badge/Google_chrome-4285F4?style=for-the-badge&logo=Google-chrome&logoColor=white)](#)

# Features

## Component Hierarchy and Props Visualization

Visualize the hierarchy of your Svelte app and check the props of each component.

<img src="/assets/treeDemo.gif" alt="tree demo gif"/>

## Record and Inspect Component State Snapshots

Record the states of your components to see how each state has changed.

<img src="/assets/inspectState.gif" alt="state inspection gif"/>

## Jumping and Skipping

- Jump through each snapshot to recreate state changes.

- Have a snapshot you want to skip? Simply toggle skip to ignore that snapshot when you jump.

<img src="/assets/timeTravel.gif" alt="time travel gif"/>

# Getting Started

## Download from the Chrome Store

Download the chrome extension [here](#).

This extension is only compatible with Svelte projects running in `development mode`, so be sure to check that configuration if you are not starting up your project with `npm run dev`.

## Manual Installation for Developers

Fork and clone this repository into your local machine. Once that is done, run the commands `npm i` and `npm run build` to download the dependencies and build the dev tool. Finally, making sure you toggle Developer mode `on` in your Chrome browser, you can load unpack the extension folder (located in the root level of the repository).

# How to Use

After installing the Chrome extension open up your project in Chrome, and be sure your Svelte application is running in `development mode`.

Right click your application and `Inspect` or press `f12` to open up Chrome Dev Tools, and navigate to the Svolte panel (which may be hidden behind `>>` if you have too many tabs).

You are then ready to debug your Svolte application!

<img src="/assets/openDev.gif" alt="open dev gif"/>

# The Svolte Team

<table>
  <tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/107030143?v=4" width="175" height="175"/>
      <br />
      <sub><b>Harry Vu</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/hnvu/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Icon"/></a>
      <a href="https://github.com/boilerpot"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Icon"/></a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/121269905?v=4" width="175" height="175"/>
      <br />
      <sub><b>Scott Kim</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/skottcim/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Icon"/></a>
      <a href="https://github.com/skottcim"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Icon"/></a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/122405088?v=4" width="175" height="175"/>
      <br />
      <sub><b>Ying-An Wang</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/yingan-wang01/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Icon"/></a>
      <a href="https://github.com/yingan-wang01"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Icon"/></a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/106777128?v=4" width="175" height="175"/>
      <br />
      <sub><b>Petros Ogbamichael</b></sub>
      <br />
      <a href="https://www.linkedin.com/in/petros-ogbamichael/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Icon"/></a>
      <a href="https://github.com/PetrosO123"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Icon"/></a>
    </td>
  </tr>
</table>

# Support

If you find Svolte to be useful please throw a :star2: our way and share this project with your Svelte developer friends!

# License

Svolte is developed under the [MIT license](/LICENSE).
