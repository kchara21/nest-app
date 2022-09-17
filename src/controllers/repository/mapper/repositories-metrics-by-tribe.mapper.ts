import { Metric_Repositories_By_Tribe } from 'src/controllers/metric/interfaces/metric-repositories-by-tribe.interface';
import { RepositoryResponse } from '../dto/response-repository.dto';

export class RepositoriesMapper {
  static toMetricsByTribeResponse(
    Metric_Repositories_By_Tribe: Metric_Repositories_By_Tribe,
  ): RepositoryResponse {
    const {
      id_metric,
      repository,
      coverage,
      code_smells,
      bugs,
      vulnerabilities,
      hotspot,
    } = Metric_Repositories_By_Tribe;
    return new RepositoryResponse({
      id: id_metric,
      name: repository.name,
      tribe: repository.tribe.name,
      organization: repository.tribe.organization.name,
      coverage: coverage + '%',
      codeSmells: code_smells,
      bugs,
      vulnerabilities,
      hotspot,
      verificationState: repository.verificationState,
      state: repository.state,
    });
  }
}
