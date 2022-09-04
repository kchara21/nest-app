import { PartialType } from '@nestjs/mapped-types';
export interface Repository_Interface {
  id: number;
  name: string;
  tribe: string;
  organization: string;
  coverage: string;
  codeSmells: number;
  bugs: number;
  vulnerabilities: number;
  hotspots: number;
  verificationState: string;
  state: string;
}

export interface RespositoryMock {
  id: number;
  state: number;
}
