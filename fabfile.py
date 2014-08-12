import os

from fabric.api import env, execute, lcd, local, parallel, roles, task
import fabdeploytools.envs
from fabdeploytools import helpers

import deploysettings as settings

env.key_filename = settings.SSH_KEY
fabdeploytools.envs.loadenv(os.path.join('/etc/deploytools/envs',
                                         settings.CLUSTER))
TRANSONIC = os.path.dirname(__file__)
ROOT = os.path.dirname(TRANSONIC)
COMMONPLACE = '%s/node_modules/commonplace/bin/commonplace' % TRANSONIC


@task
def pre_update(ref):
    with lcd(TRANSONIC):
        local('git fetch')
        local('git fetch -t')
        local('git reset --hard %s' % ref)


@task
def update():
    with lcd(TRANSONIC):
        local('npm install')
        local('npm install --force commonplace@0.4.22')
        local('%s includes' % COMMONPLACE)
        local('%s langpacks' % COMMONPLACE)


@task
@roles('web')
@parallel
def _install_package(rpmbuild):
    rpmbuild.install_package()


@task
def deploy():
    with lcd(TRANSONIC):
        ref = local('git rev-parse HEAD', capture=True)

    rpmbuild = helpers.deploy(name='transonic',
                              env=settings.ENV,
                              cluster=settings.CLUSTER,
                              domain=settings.DOMAIN,
                              root=ROOT,
                              deploy_roles=['web'],
                              package_dirs=['transonic'])
