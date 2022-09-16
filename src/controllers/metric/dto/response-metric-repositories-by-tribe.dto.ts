import { Timestamp } from 'typeorm';
import { Metric_Repositories_By_Tribe } from '../interfaces/metric-repositories-by-tribe.interface';

export class MetricsResponse implements Metric_Repositories_By_Tribe {
  constructor(dto: MetricsResponse) {
    Object.assign(this, dto);
  }
  readonly id_metric: number;
  readonly coverage: number;
  readonly bugs: number;
  readonly vulnerabilities: number;
  readonly hotspot: number;
  readonly code_smells: number;
  readonly repository: {
    readonly id_repository: number;
    readonly name: string;
    readonly state: string;
    readonly create_time: Timestamp;
    readonly status: string;
    readonly verificationState: string;
    readonly tribe: {
      readonly id_tribe: number;
      readonly name: string;
      readonly status: number;
      readonly organization: {
        readonly id_organization: number;
        readonly name: string;
        readonly status: number;
      };
    };
  };
}
