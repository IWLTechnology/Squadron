# Squadron
A top-down 2D retro-style space arcade game available in electron-packaged versions (recommended), or a web format, as indicated in the "Web" section of the description of this repository. It supports gamepads, and the changing of controls.

# Installation

Squadron comes packaged in several formats, all available under the "Releases" section of the Github Repository (https://github.com/IWLTechnology/Squadron/releases). These include:

    .rpm (for systems using dnf, e.g. Fedora or RHEL)
    .deb (for systems using apt, e.g. Debian or Ubuntu)
    .zip (for all linux systems)
    .exe (for Windows systems, recommended)
    .msi (alternate option for Windows systems)


Download the latest release from the "Releases tab".

Alternatively, you can register the official Squadron RPM repository (for systems with DNF only).
Create the file /etc/yum.repos.d/squadron.repo with the following contents:

    [squadron]
    name=squadron
    baseurl=https://iwltechnology.github.io/squadron-rpm/
    enabled=1
    gpgcheck=0

Then, run the following to install Squadron:

    sudo dnf makecache --refresh
    sudo dnf install Squadron -y

## Licensing
Everything contained in this repository, unless otherwise stated in the credits section of the game, is licensed under the GNU General Public License v3.0 only (GPL-3.0-only).
