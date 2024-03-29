import { RuleSettings } from '@portfoolio/api/models/interfaces/rule-settings.interface';
import { Rule } from '@portfoolio/api/models/rule';
import { UserSettings } from '@portfoolio/common/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RulesService {
  public constructor() {}

  public async evaluate<T extends RuleSettings>(
    aRules: Rule<T>[],
    aUserSettings: UserSettings
  ) {
    return aRules
      .filter((rule) => {
        return rule.getSettings(aUserSettings)?.isActive;
      })
      .map((rule) => {
        const evaluationResult = rule.evaluate(rule.getSettings(aUserSettings));
        return { ...evaluationResult, name: rule.getName() };
      });
  }
}
