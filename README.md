# Description

This repository is a sample of how to run Apryse's Fluent application in a
docker compose file.

## Prerequisites

You will need docker and yarn installed on your system. This document assumes
that you have [Homebrew](https://brew.sh/) if you're running on Mac and
[Winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) on
Windows.

```sh
# Mac
brew install yarn
brew install --cask docker

# Windows
winget install Yarn.Yarn
winget install Docker.DockerDesktop
```

> Running docker on windows requires you to have the
> [Windows WSL](https://docs.docker.com/desktop/setup/install/windows-install/)
> layer installed.

Once docker and yarn are installed, simply run docker desktop from your
application list or your start menu depending on your operating system. This
will setup the docker daemon. To validate that you have installed everything
correctly, simply run

```sh
yarn --version
docker --version
docker compose version
```

If you get an output, then you are ready for the next step.

## Usage

```sh
yarn install
docker compose up --build

# Navigate to localhost in your web browser and use credentials
# Username: admin@fake.email
# Password: admin-pa73305word
```

When you're ready to stop the instance.

```sh
docker compose down
```

## Run the Sample App

```sh
# Make sure to run docker compose up first in a different terminal or
# Run docker compose up -d in the same terminal
# The fluent manager and engine must be running for this to work.
# Before you run this, you will also want to upload 1 template as the
# actual test will just use the first template it finds
yarn workspace @anthony-bonta-gaf-energy/fluent-test start
```
