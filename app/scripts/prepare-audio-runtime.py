"""Prepare an isolated build-only runtime using public pinned dependencies.
No dependencies are installed into the system interpreter or website payload.
"""
import argparse,pathlib,subprocess,sys,venv
ROOT=pathlib.Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--environment',required=True);args=p.parse_args()
environment=pathlib.Path(args.environment).resolve()
if environment==ROOT or ROOT in environment.parents:p.error('Build environment must stay outside the app.')
venv.EnvBuilder(with_pip=True).create(environment)
python=environment/'bin/python'
subprocess.run([str(python),'-m','pip','install','--no-input','-r',str(ROOT/'audio/requirements-lock.txt')],check=True)
subprocess.run([str(python),'-c','import torch, transformers, numpy; print(torch.__version__, transformers.__version__, numpy.__version__)'],check=True)
print('Build-only Python:',python)
