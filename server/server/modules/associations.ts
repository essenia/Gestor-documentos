import Caso from './casos/caso.model';
import Cliente from './cliente/cliente.model';
import TipoTramite from './tipoTramite/tipoTramite.model';
import CasoDocumento from './CasoDocumento/casoDocumento.model';
import TipoDocumento from './tipoDocumento/tipoDocumento.model';

// Caso
Caso.belongsTo(Cliente, {
  foreignKey: 'id_cliente',
  as: 'cliente'
});

Caso.belongsTo(TipoTramite, {
  foreignKey: 'tipo_tramite_id',
  as: 'tipoTramite'
});

Caso.hasMany(CasoDocumento, {
  foreignKey: 'id_caso',
  as: 'documentos'
});

// CasoDocumento
CasoDocumento.belongsTo(Caso, {
  foreignKey: 'id_caso',
  as: 'caso'
});

CasoDocumento.belongsTo(TipoDocumento, {
  foreignKey: 'tipo_documento_id',
  as: 'tipoDocumento'
});
