"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFaturaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_fatura_dto_1 = require("./create-fatura.dto");
class UpdateFaturaDto extends (0, mapped_types_1.PartialType)(create_fatura_dto_1.CreateFaturaDto) {
}
exports.UpdateFaturaDto = UpdateFaturaDto;
//# sourceMappingURL=update-fatura.dto.js.map