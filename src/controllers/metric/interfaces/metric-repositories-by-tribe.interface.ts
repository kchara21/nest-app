import { Timestamp } from 'typeorm';

export interface Metric_Repositories_By_Tribe {
  id_metric: number;
  coverage: number;
  bugs: number;
  vulnerabilities: number;
  hotspot: number;
  code_smells: number;
  repository: {
    id_repository: number;
    name: string;
    state: string;
    create_time: Timestamp;
    status: string;
    verificationState: string;
    tribe: {
      id_tribe: number;
      name: string;
      status: number;
      organization: {
        id_organization: number;
        name: string;
        status: number;
      };
    };
  };
}
