"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReceitaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_receita_dto_1 = require("./create-receita.dto");
class UpdateReceitaDto extends (0, swagger_1.PartialType)(create_receita_dto_1.CreateReceitaDto) {
}
exports.UpdateReceitaDto = UpdateReceitaDto;
//# sourceMappingURL=update-receita.dto.js.map