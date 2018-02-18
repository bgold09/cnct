# cnct

Install your dotfiles, no matter what platform you're on.

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b9d43bef8b8f4d5f8302d0720fb57c43)](https://www.codacy.com/app/brian.golden09/cnct?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=bgold09/cnct&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/b9d43bef8b8f4d5f8302d0720fb57c43)](https://www.codacy.com/app/brian.golden09/cnct?utm_source=github.com&utm_medium=referral&utm_content=bgold09/cnct&utm_campaign=Badge_Coverage)

## Build Status

|Branch        |Windows|Linux / OSX|
|:------------:|:-----:|:---------:|
|**develop**   | [![Build status](https://ci.appveyor.com/api/projects/status/p3t0ygdcw6fubf7k/branch/develop?svg=true)](https://ci.appveyor.com/project/bgold09/cnct/branch/develop) | [![Build Status](https://travis-ci.org/bgold09/cnct.svg?branch=develop)](https://travis-ci.org/bgold09/cnct) |
|**master**    | [![Build status](https://ci.appveyor.com/api/projects/status/p3t0ygdcw6fubf7k/branch/master?svg=true)](https://ci.appveyor.com/project/bgold09/cnct/branch/master)   | [![Build Status](https://travis-ci.org/bgold09/cnct.svg?branch=master)](https://travis-ci.org/bgold09/cnct)  |

## Overview

Cnct is a cross-platform command-line tool that aims to make bootstrapping your developer environment
easier. This is accomplished by providing a set of common operations (e.g. creating symlinks) that can
be expressed in a simple configuration.

## Configuration file

The configuration file is how you express the steps that `cnct` should perform. The configuration is an
array of steps that will be completed in order. For the full schema of a `cnct` configuration file, see
the [schema for the cnct version you are using](schema).

## Usage

The simplest way to run your setup as specified in the configuration file is to run `cnct` from the
directory that contains your `cnct.json` file:

```sh
cd ~/.dotfiles
cnct
```

You can also explicitly point to the location of your config:

```sh
cnct -c ~/.dotfiles/cnct.json
```

## Thanks and Credit for Inspiration

  * [Anish Athalye](https://github.com/anishathalye) for [dotbot](https://github.com/anishathalye/dotbot)
  , which heavily inspired this project
