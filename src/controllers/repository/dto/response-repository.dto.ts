import { Repository_Interface } from '../interfaces/repository.interface';

export class RepositoryResponse implements Repository_Interface {
  readonly id: number;
  readonly name: string;
  readonly tribe: string;
  readonly organization: string;
  readonly coverage: string;
  readonly codeSmells: number;
  readonly bugs: number;
  readonly vulnerabilities: number;
  readonly hotspots: number;
  readonly verificationState: string;
  readonly state: string;
  constructor(dto: RepositoryResponse) {
    Object.assign(this, dto);
  }
}
