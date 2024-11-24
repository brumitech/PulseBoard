import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private db: Database | null = null;

  async onModuleInit() {
    this.db = await open({
      filename: './database/dev.sqlite3',
      driver: sqlite3.Database,
    });

    // Enable foreign keys
    await this.db.run('PRAGMA foreign_keys = ON');

    // Run migrations if needed
    await this.runMigrations();
  }

  async onModuleDestroy() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }

  async runMigrations() {
    const db = await this.getDatabase();
    // Create migrations table if it doesn't exist
    await db.run(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add your migrations here
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async getDatabase() {
    if (!this.db) {
      throw new Error('Database connection not initialized');
    }
    return this.db;
  }

  // Helper methods for common operations
  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const db = await this.getDatabase();
    return db.all(sql, params);
  }

  async execute(sql: string, params: any[] = []): Promise<void> {
    const db = await this.getDatabase();
    await db.run(sql, params);
  }
}
