## Demo

[Live Demo](https://jdbernard.github.io/lightdm-uestibulum) (view in
fullscreen).

## Prerequisites

* [lightdm-webkit2-greeter](https://github.com/Antergos/lightdm-webkit2-greeter)

## Installation

Download and install the `uestibulum` theme:

    git clone https://github.com/jdbernard/lightdm-uestibulum.git
    sudo cp -r lightdm-uestibulum /usr/share/lightdm/uestibulum

Change the `webkit-theme` value in `/etc/lightdm/lightdm-webkit2-greeter.conf`:

    [greeter]
    webkit-theme = uestibulum

Configure lightdm to use the webkit2 greeter by creating the
`/usr/share/lightdm/lightdm.conf.d/60-lightdm-webkit2-greeter.conf` file with
the following contents:

    [Seat:*]
    greeter-session=lightdm-webkit2-greeter

Disable the GTK greeter:

    sudo mkdir /usr/share/lightdm/lightdm.conf.d.disabled
    sudo mv /usr/share/lightdm/lightdm.conf.d/60-lightdm-gtk-greeter.conf /usr/share/lightdm/lightdm.conf.d.disabled


*On distributions other than Ubuntu, lightdm configuration files may be in
different locations. Consult your distribution's documentation for details.*

## Lisence

Lisenced under the [MIT License](https://opensource.org/licenses/MIT)
(see [LICENSEE.md](LICENSE.md)).

### Attributions

Images taken from [unsplash.com](unsplash.com). Used under the [unsplash
lisence](https://unsplash.com/license).

[Exo 2](https://fonts.google.com/specimen/Exo+2) font lisenced under the
[Open Font Lisence](http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL_web).
