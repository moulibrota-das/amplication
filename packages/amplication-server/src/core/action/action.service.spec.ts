import { Test, TestingModule } from '@nestjs/testing';
import { ActionService, SELECT_ID } from './action.service';
import { PrismaService } from 'nestjs-prisma';
import { Action } from './dto/Action';
import { ActionStep } from './dto/ActionStep';
import { EnumActionStepStatus } from './dto/EnumActionStepStatus';
import { FindOneActionArgs } from './dto/FindOneActionArgs';
import { EnumActionLogLevel } from './dto';

const EXAMPLE_ACTION_ID = 'exampleActionId';
const EXAMPLE_ACTION_STEP_ID = 'exampleActionStepId';
const EXAMPLE_ACTION: Action = {
  id: EXAMPLE_ACTION_ID,
  createdAt: new Date()
};

const EXAMPLE_ACTION_STEP: ActionStep = {
  id: EXAMPLE_ACTION_STEP_ID,
  createdAt: new Date(),
  message: 'ExampleActionMessage',
  status: EnumActionStepStatus.Running,
  completedAt: null,
  logs: null
};
const EXAMPLE_MESSAGE = 'Example message';
const EXAMPLE_STATUS = EnumActionStepStatus.Success;
const EXAMPLE_LEVEL = EnumActionLogLevel.Info;

const prismaActionFindOneMock = jest.fn(() => EXAMPLE_ACTION);
const prismaActionStepFindManyMock = jest.fn(() => [EXAMPLE_ACTION_STEP]);
const prismaActionStepCreateMock = jest.fn(() => EXAMPLE_ACTION_STEP);
const prismaActionStepUpdateMock = jest.fn();
const prismaActionLogCreateMock = jest.fn();

describe('ActionService', () => {
  let service: ActionService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActionService,
        {
          provide: PrismaService,
          useValue: {
            action: {
              findOne: prismaActionFindOneMock
            },
            actionStep: {
              findMany: prismaActionStepFindManyMock,
              create: prismaActionStepCreateMock,
              update: prismaActionStepUpdateMock
            },
            actionLog: {
              create: prismaActionLogCreateMock
            }
          }
        }
      ]
    }).compile();

    service = module.get<ActionService>(ActionService);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('finds one action', async () => {
    const args: FindOneActionArgs = {
      where: {
        id: EXAMPLE_ACTION_ID
      }
    };
    expect(await service.findOne(args)).toEqual(EXAMPLE_ACTION);
  });

  test('gets action steps', async () => {
    expect(await service.getSteps(EXAMPLE_ACTION_ID)).toEqual([
      EXAMPLE_ACTION_STEP
    ]);
  });

  test('creates action step', async () => {
    expect(
      await service.createStep(EXAMPLE_ACTION_ID, EXAMPLE_MESSAGE)
    ).toEqual(EXAMPLE_ACTION_STEP);
    expect(prismaActionStepCreateMock).toBeCalledTimes(1);
    expect(prismaActionStepCreateMock).toBeCalledWith({
      data: {
        status: EnumActionStepStatus.Running,
        message: EXAMPLE_MESSAGE,
        action: {
          connect: { id: EXAMPLE_ACTION_ID }
        }
      }
    });
  });

  test('updates action step status', async () => {
    expect(
      await service.updateStatus(EXAMPLE_ACTION_STEP, EXAMPLE_STATUS)
    ).toBeUndefined();
    expect(prismaActionStepUpdateMock).toBeCalledTimes(1);
    expect(prismaActionStepUpdateMock).toBeCalledWith({
      where: {
        id: EXAMPLE_ACTION_STEP_ID
      },
      data: {
        status: EXAMPLE_STATUS
      },
      select: SELECT_ID
    });
  });

  test('logs into action step', async () => {
    expect(
      await service.log(EXAMPLE_ACTION_STEP, EXAMPLE_LEVEL, EXAMPLE_MESSAGE)
    ).toBeUndefined();
    expect(prismaActionLogCreateMock).toBeCalledTimes(1);
    expect(prismaActionLogCreateMock).toBeCalledWith({
      data: {
        level: EXAMPLE_LEVEL,
        message: EXAMPLE_MESSAGE,
        meta: {},
        step: {
          connect: { id: EXAMPLE_ACTION_STEP_ID }
        }
      },
      select: SELECT_ID
    });
  });

  test('logs info into action step', async () => {
    expect(
      await service.logInfo(EXAMPLE_ACTION_STEP, EXAMPLE_MESSAGE)
    ).toBeUndefined();
    expect(prismaActionLogCreateMock).toBeCalledTimes(1);
    expect(prismaActionLogCreateMock).toBeCalledWith({
      data: {
        level: EnumActionLogLevel.Info,
        message: EXAMPLE_MESSAGE,
        meta: {},
        step: {
          connect: { id: EXAMPLE_ACTION_STEP_ID }
        }
      },
      select: SELECT_ID
    });
  });
});
