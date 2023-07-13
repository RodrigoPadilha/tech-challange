export interface IConnectionDatabase {
  // Métodos para criar a conexão com o banco de dados
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getConnection(): any;
}
