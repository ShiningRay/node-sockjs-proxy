require 'rubygems'
require 'celluloid/zmq'

Celluloid::ZMQ.init

class Server
  include Celluloid::ZMQ

  def initialize(address)
    @socket = RepSocket.new

    begin
      @socket.connect(address)
    rescue IOError
      @socket.close
      raise
    end
  end

  def run
    loop { async.handle_message @socket.read }
  end

  def handle_message(message)
    puts "got message: #{message}"
  end
end


addr = 'tcp://127.0.0.1:3000'

server = Server.new(addr)

server.async.run
sleep