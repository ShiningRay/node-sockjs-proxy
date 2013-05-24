require 'rubygems'
require 'ffi-rzmq'
trap 'INT' do
  exit
end
ctx = ZMQ::Context.create(1)
def error_check(rc)
  if ZMQ::Util.resultcode_ok?(rc)
    false
  else
    STDERR.puts "Operation failed, errno [#{ZMQ::Util.errno}] description [#{ZMQ::Util.error_string}]"
    caller(1).each { |callstack| STDERR.puts(callstack) }
    true
  end
end
   pull_sock = ctx.socket(ZMQ::PULL)

   error_check(pull_sock.setsockopt(ZMQ::LINGER, 0))

rc = pull_sock.connect('tcp://127.0.0.1:3000')

error_check(rc)
message = ''
rc = 0
    while ZMQ::Util.resultcode_ok?(rc)
      rc = pull_sock.recv_string(message)
      puts "Pull I received a message '#{message}'"
    end

    error_check(pull_sock.close)
    puts "Socket closed; thread terminating"