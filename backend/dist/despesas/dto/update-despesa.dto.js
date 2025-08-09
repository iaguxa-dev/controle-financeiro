"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDespesaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_despesa_dto_1 = require("./create-despesa.dto");
class UpdateDespesaDto extends (0, mapped_types_1.PartialType)(create_despesa_dto_1.CreateDespesaDto) {
}
exports.UpdateDespesaDto = UpdateDespesaDto;
//# sourceMappingURL=update-despesa.dto.js.map