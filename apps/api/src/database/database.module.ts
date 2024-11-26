import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        console.log('Attempting to connect to MongoDB...'); // Add this
        return {
          uri,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              console.log('MongoDB connected successfully!'); // Add this
            });
            connection.on('error', (error) => {
              console.error('MongoDB connection error:', error); // Add this
            });
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
