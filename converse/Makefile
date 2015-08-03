# ***** BEGIN LICENSE BLOCK *****
# Zimbra Collaboration Suite Web Client
# Copyright (C) 2015 Zimbra, Inc.
# 
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU General Public License as published by the Free Software Foundation,
# version 2 of the License.
# 
# This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
# without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
# See the GNU General Public License for more details.
# You should have received a copy of the GNU General Public License along with this program.
# If not, see <http://www.gnu.org/licenses/>.
# ***** END LICENSE BLOCK *****

TEE = tee
MKDIR = mkdir -p

NODE = node
NPM = npm
GRUNT = grunt
BOWER ?= node_modules/.bin/bower
ANT = ant -emacs
P4 = p4
PATCH = patch
MAKE  = make


CONVERSE_VERS := $(shell $(ANT) -q -f ../build.xml get-converse-version | head -1)
CONVERSEDIR = converse.js-$(CONVERSE_VERS)
PATCH_DIR ?= patches

all: diff

#
# install required Node packages locally and build TinyMCE
#
build:
	cd $(CONVERSEDIR) && $(NPM) install
	cd $(CONVERSEDIR) && $(BOWER) install
	cd $(CONVERSEDIR) && $(GRUNT) jst
	cd $(CONVERSEDIR) && $(MAKE) build

#
# generate a patch using the p4 diff on current workspace.
#
diff: build
	$(MKDIR) $(PATCH_DIR)
	$(P4) -d $(CONVERSEDIR) diff -du3 | $(TEE) work.diff
