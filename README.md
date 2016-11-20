### Prerequisites

* [lightdm-webkit2-greeter](https://github.com/Antergos/lightdm-webkit2-greeter)

## Installation

Download and install the `uestibulum` theme:

    git clone https://github.com/jdbernard/lightdm-uestibulum.git
    sudo mv lightdm-uestibulum /usr/share/lightdm

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
