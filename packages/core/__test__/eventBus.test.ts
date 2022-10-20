import { EventBus } from '../src/eventBus';

test('EventBus', () => {
  let result = '';
  let result2 = '';
  EventBus.Ins.on('test', function (...params) {
    result = (result + ' ' + params.join(' ')).trim();
  });
  EventBus.Ins.emit('test', 'hello', 'world');
  EventBus.Ins.emit('test', 'hello');
  EventBus.Ins.emit('test', 'world');

  const eb = new EventBus();
  let cb;
  eb.on(
    'test',
    (cb = function (...params: any[]) {
      result2 = (result2 + ' ' + params.join(' ')).trim();
    }),
  );
  eb.emit('test', 'world');

  eb.off('test', cb);
  eb.emit('test', 'hello');

  expect(result).toBe('hello world hello world');
  expect(result2).toBe('world');

  // edge
  const eb2 = EventBus.Ins;
  eb2.on(
    'test',
    (cb = function (...params: any[]) {
      result2 = (result2 + ' ' + params.join(' ')).trim();
    }),
  );
  eb2.emit('test', 'world');
  expect(result2).toBe('world world');

  eb2.offAll();
  eb2.emit('test', 'world');
  expect(result2).toBe('world world');

  expect(eb2.getCallbackList('test2')).toEqual([]);
});
test('once', () => {
  let result = '';
  EventBus.Ins.once('test', function (...params) {
    result = (result + ' ' + params.join(' ')).trim();
  });
  EventBus.Ins.emit('test', 'hello', 'world once');
  EventBus.Ins.emit('test', 'hello');
  EventBus.Ins.emit('test', 'world');

  expect(result).toBe('hello world once');
});
test('times', () => {
  let result = '';
  EventBus.Ins.times(10, 'test', function (...params) {
    result = (result + ' ' + params.join(' ')).trim();
  });
  [...Array(20).keys()].forEach((item) => {
    EventBus.Ins.emit('test', item);
  });

  expect(result).toBe([...Array(10).keys()].join(' '));
});
